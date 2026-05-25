from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
import secrets

from app.database import db
from app.models.user_model import UserSignup, UserLogin

from app.utils.auth import (
    hash_password,
    verify_password,
    create_access_token
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    email: EmailStr
    token: str
    new_password: str


@router.post("/signup")
async def signup(user: UserSignup):

    existing_user = await db.users.find_one({
        "email": user.email
    })

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    hashed_password = hash_password(user.password)

    new_user = {
        "name": user.name,
        "email": user.email.strip().lower(),
        "password": hashed_password
    }

    await db.users.insert_one(new_user)

    return {
        "message": "User created successfully"
    }


@router.post("/login")
async def login(user: UserLogin):

    existing_user = await db.users.find_one({
    "email": user.email.strip().lower()
})

    if not existing_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    valid_password = verify_password(
        user.password,
        existing_user["password"]
    )

    if not valid_password:
        raise HTTPException(
            status_code=401,
            detail="Invalid password"
        )

    token = create_access_token({
        "email": existing_user["email"]
    })

    return {
        "message": "Login successful",
        "access_token": token
    }


@router.post("/forgot-password")
async def forgot_password(data: ForgotPasswordRequest):

    clean_email = data.email.strip().lower()
    user = await db.users.find_one({
    "email": clean_email
    })

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    reset_token = secrets.token_urlsafe(32)
    print("RESET TOKEN GENERATED:", reset_token)

    await db.users.update_one(
        {"email": clean_email},
        {
            "$set": {
                "reset_token": reset_token
            }
        }
    )

    return {
        "message": "Password reset token generated",
        "reset_token": reset_token
    }


@router.post("/reset-password")
async def reset_password(data: ResetPasswordRequest):

    clean_email = data.email.strip().lower()
    clean_token = data.token.strip()
    clean_password = data.new_password.strip()

    user = await db.users.find_one({
        "email": clean_email,
        "reset_token": clean_token
    })

    if not user:
        raise HTTPException(
            status_code=400,
            detail="Invalid email or reset token"
        )

    new_hashed_password = hash_password(clean_password)

    await db.users.update_one(
        {"email": clean_email},
        {
            "$set": {
                "password": new_hashed_password
            },
            "$unset": {
                "reset_token": ""
            }
        }
    )

    return {
        "message": "Password reset successful"
    }