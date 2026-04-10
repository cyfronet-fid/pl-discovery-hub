"""Contact endpoint"""
import os

from fastapi import APIRouter, HTTPException
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType

import logging
import smtplib


from app.schemas.contact import BecomeProviderForm
from app.settings import settings

router = APIRouter()

logging.basicConfig(level=logging.DEBUG)
smtplib.SMTP.debuglevel = 1

@router.post("/contact")
async def send_contact_message(contact_form: BecomeProviderForm):
    """Send contact message to our support inbox"""

    message = MessageSchema(
        subject=f"New Contact Form Message from {contact_form.email}",
        recipients=[settings.EMAIL_RECEIVER],
        body=f"""
        Email: {contact_form.email}
        Resource: {contact_form.option}
        Message: {contact_form.message}
        """,
        subtype=MessageType.plain,
    )

    conf = ConnectionConfig(
        MAIL_USERNAME=settings.EMAIL_SMTP_USER,
        MAIL_PASSWORD=settings.EMAIL_SMTP_PASSWORD,
        MAIL_FROM=settings.EMAIL_SENDER,
        MAIL_PORT=int(settings.EMAIL_SMTP_PORT),
        MAIL_SERVER=settings.EMAIL_SMTP_SERVER,
        MAIL_STARTTLS=True,
        MAIL_SSL_TLS=False,
        USE_CREDENTIALS=True,
    )

    fast_mail = FastMail(conf)

    try:
        await fast_mail.send_message(message)
        return {"detail": "Message sent successfully"}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to send email: {str(e)}"
        ) from e
