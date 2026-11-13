
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from datetime import date

from ai_engine import (
    healthcare_assistant,
    recommend_professionals
)

from database import initialize_database, get_connection


# ==========================================
# CREATE FASTAPI APPLICATION
# ==========================================

app = FastAPI(
    title="CareConnect API",
    description="AI Powered Home Healthcare Platform",
    version="1.0.0"
)


# ==========================================
# CORS CONFIGURATION
# ==========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# ==========================================
# DATABASE INITIALIZATION
# ==========================================

@app.on_event("startup")
def startup_event():
    initialize_database()


# ==========================================
# PYDANTIC MODELS
# ==========================================

class ChatRequest(BaseModel):
    message: str = Field(
        min_length=1,
        max_length=1500
    )


class MatchRequest(BaseModel):
    service: str = Field(
        min_length=1,
        max_length=100
    )

    city: str = Field(
        min_length=1,
        max_length=100
    )

    professionals: list[dict] = Field(
        default_factory=list
    )


class BookingRequest(BaseModel):
    patient_name: str = Field(
        min_length=2,
        max_length=100
    )

    phone: str = Field(
        min_length=10,
        max_length=15
    )

    service: str = Field(
        min_length=2,
        max_length=100
    )

    professional_name: str = Field(
        min_length=2,
        max_length=100
    )

    city: str = Field(
        min_length=2,
        max_length=100
    )

    appointment_date: date

    notes: str = Field(
        default="",
        max_length=500
    )


# ==========================================
# HOME ROUTE
# ==========================================

@app.get("/")
def home():
    return {
        "success": True,
        "message": "Welcome to CareConnect API",
        "service": "Home Healthcare Platform"
    }


# ==========================================
# HEALTH CHECK
# ==========================================

@app.get("/health")
def health_check():
    return {
        "success": True,
        "status": "healthy",
        "service": "CareConnect Backend"
    }


# ==========================================
# AI HEALTHCARE CHATBOT
# ==========================================

@app.post("/api/ai/chat")
def chat_with_ai(request: ChatRequest):

    result = healthcare_assistant(request.message)

    return {
        "success": True,
        "data": result
    }


# ==========================================
# SMART PROFESSIONAL MATCHING
# ==========================================

@app.post("/api/ai/match")
def match_professionals(request: MatchRequest):

    recommendations = recommend_professionals(
        professionals=request.professionals,
        service=request.service,
        city=request.city
    )

    return {
        "success": True,
        "total_matches": len(recommendations),
        "recommendations": recommendations
    }


# ==========================================
# CREATE APPOINTMENT BOOKING
# ==========================================

@app.post("/api/bookings")
def create_booking(booking: BookingRequest):

    connection = get_connection()

    try:
        cursor = connection.execute(
            """
            INSERT INTO appointments (
                patient_name,
                phone,
                service,
                professional_name,
                city,
                appointment_date,
                notes
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                booking.patient_name,
                booking.phone,
                booking.service,
                booking.professional_name,
                booking.city,
                booking.appointment_date.isoformat(),
                booking.notes
            )
        )

        connection.commit()

        return {
            "success": True,
            "message": "Appointment request submitted successfully!",
            "booking_id": cursor.lastrowid,
            "status": "Pending"
        }

    except Exception as error:
        connection.rollback()
        raise HTTPException(
            status_code=500,
            detail="Unable to save appointment."
        )

    finally:
        connection.close()


# ==========================================
# VIEW PATIENT BOOKINGS
# ==========================================

@app.get("/api/bookings")
def get_bookings(phone: str):

    connection = get_connection()

    try:
        rows = connection.execute(
            """
            SELECT *
            FROM appointments
            WHERE phone = ?
            ORDER BY created_at DESC
            """,
            (phone,)
        ).fetchall()

        return {
            "success": True,
            "total": len(rows),
            "bookings": [
                dict(row) for row in rows
            ]
        }

    finally:
        connection.close()
