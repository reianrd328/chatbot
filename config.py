import os

class Config:
    # Flask
    SECRET_KEY = os.getenv("SECRET_KEY", "change-this-secret")

    # Database
    DB_HOST = os.getenv("DB_HOST")
    DB_PORT = os.getenv("DB_PORT", "4000")
    DB_USER = os.getenv("DB_USER")
    DB_PASSWORD = os.getenv("DB_PASSWORD")
    DB_NAME = os.getenv("DB_NAME", "chatbot")

    SQLALCHEMY_DATABASE_URI = (
        f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}"
        f"@{DB_HOST}:{DB_PORT}/{DB_NAME}"
        "?ssl_verify_cert=false"
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # AI
    API_KEY = os.getenv("API_KEY")
    BASE_URL = os.getenv(
        "BASE_URL",
        "https://router.bynara.id/v1"
    )

    MODEL = os.getenv(
        "MODEL",
        "agnes-2.5-flash"
    )
