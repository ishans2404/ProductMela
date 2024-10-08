import os
from datetime import timedelta, timezone, datetime
from typing import Annotated
from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel
from fastapi.security import OAuth2PasswordRequestForm
from jose import jwt
from dotenv import load_dotenv
from api.models import User
from api.deps import db_dependency, bcrypt_context

load_dotenv()

router = APIRouter(
    prefix='/auth',
    tags=['auth']
)

SECRET_KEY = os.getenv('AUTH_SECRET_KEY')
ALGORITHM = os.getenv("AUTH_ALGORITHM")

class UserCreateRequest(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class Register(BaseModel):
    register_status: bool

def authenticate_user(username: str, password: str, db):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        return None
    if not bcrypt_context.verify(password, user.hashed_password):
        return None
    return user

def create_access_token(username: str, user_id: int, expires_delta: timedelta):
    encode = {'sub': username, 'id': user_id}
    expires = datetime.now(timezone.utc) + expires_delta
    encode.update({'exp': expires})
    return jwt.encode(encode, SECRET_KEY, algorithm=ALGORITHM)

@router.post('/', status_code=status.HTTP_201_CREATED, response_model=Register)
async def create_user(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: db_dependency):
    print(f"Username: {form_data.username}")
    print(f"Password: {form_data.password}")
    create_user_model = User(
        username=form_data.username,
        hashed_password=bcrypt_context.hash(form_data.password)
    )
    try:
        db.add(create_user_model)
        db.commit()
        return {'register_status': True}
    except Exception as e:
        # raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
        return {'register_status': False}

@router.post('/token', response_model=Token)
async def login_for_access_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: db_dependency):
    print(f"Username: {form_data.username}")
    print(f"Password: {form_data.password}")
    user = authenticate_user(form_data.username, form_data.password, db)
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Cant validate user')
    token = create_access_token(user.username, user.id, timedelta(minutes=20))
    return {'access_token': token, 'token_type': 'bearer'}


# async def create_user(db: db_dependency, create_user_request: UserCreateRequest):
#     create_user_model = User(
#         username=create_user_request.username,
#         hashed_password=bcrypt_context.hash(create_user_request.password)
#     )
#     db.add(create_user_model)
#     db.commit()