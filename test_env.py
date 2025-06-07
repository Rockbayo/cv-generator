﻿from dotenv import load_dotenv
import os

load_dotenv()

print(f'DB_HOST: {os.getenv("DB_HOST")}')
print(f'DB_USER: {os.getenv("DB_USER")}')
print(f'DB_PASSWORD: {os.getenv("DB_PASSWORD")}')
print(f'DB_NAME: {os.getenv("DB_NAME")}')
