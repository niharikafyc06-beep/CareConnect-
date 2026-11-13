
from typing import List


# ==========================================
# CARECONNECT HEALTHCARE KNOWLEDGE BASE
# ==========================================

KNOWLEDGE_BASE = {
    "nursing": (
        "CareConnect can help you explore home nursing services, "
        "including post-operative support, wound-care assistance, "
        "routine nursing and vital-sign monitoring. Clinical procedures "
        "must be performed by qualified healthcare professionals."
    ),

    "elderly": (
        "Elderly care may include personal care, companionship, "
        "mobility assistance, meal support and daily living activities. "
        "Choose a caregiver according to the individual's needs."
    ),

    "physiotherapy": (
        "Home physiotherapy can support rehabilitation, mobility "
        "and recovery. A qualified physiotherapist should assess "
        "the patient and prepare an appropriate treatment plan."
    ),

    "medicine": (
        "For medicine-related concerns, consult a qualified doctor "
        "or pharmacist. Never start, stop or change medication "
        "or dosage based only on chatbot advice."
    ),

    "doctor": (
        "A doctor can assess symptoms, recommend investigations "
        "and provide treatment. CareConnect can help you explore "
        "consultation and home-visit services."
    ),

    "first_aid": (
        "For minor injuries, keep the affected area clean and seek "
        "appropriate medical advice. For severe bleeding, burns, "
        "serious injuries or worsening symptoms, seek urgent medical "
        "care. Do not attempt unfamiliar medical procedures."
    ),

    "childcare": (
        "Child healthcare includes routine check-ups, vaccination "
        "guidance, nutrition and monitoring growth. Consult a "
        "paediatrician for concerns about a child's health."
    ),

    "mental_health": (
        "Mental wellbeing is important. Consider speaking with "
        "a qualified mental health professional if you are feeling "
        "overwhelmed, anxious or persistently low. If you may harm "
        "yourself or someone else, seek immediate emergency help."
    ),

    "symptoms": (
        "I can provide general health information, but I cannot "
        "diagnose symptoms. Please consult a qualified doctor, "
        "especially if symptoms are severe, persistent or worsening. "
        "Tell me what general health information you are looking for."
    ),

    "reports": (
        "I can help explain common medical terms and abbreviations "
        "in a report. However, test results must be interpreted by "
        "a qualified doctor in the context of your medical history."
    ),

    "general": (
        "Welcome to CareConnect! I can help with home nursing, "
        "elderly care, physiotherapy, doctor consultations, "
        "first aid, child healthcare, mental wellbeing and "
        "general medical information. I cannot diagnose conditions "
        "or replace a qualified healthcare professional."
    )
}


# ==========================================
# EMERGENCY DETECTION
# ==========================================

EMERGENCY_KEYWORDS = [
    "chest pain",
    "difficulty breathing",
    "cannot breathe",
    "can't breathe",
    "unconscious",
    "severe bleeding",
    "heavy bleeding",
    "stroke symptoms",
    "face drooping",
    "sudden weakness",
    "not responding",
    "overdose",
    "seizure",
    "suicide",
    "suicidal",
    "severe allergic reaction"
]


def detect_emergency(message: str) -> bool:
    text = message.lower()

    return any(
        keyword in text
        for keyword in EMERGENCY_KEYWORDS
    )


# ==========================================
# LIGHTWEIGHT INTENT RECOGNITION
# ==========================================

INTENT_KEYWORDS = {
    "nursing": [
        "nurse", "nursing", "injection",
        "wound dressing", "dressing"
    ],

    "elderly": [
        "elderly", "old age", "caregiver",
        "senior", "grandparent", "parent"
    ],

    "physiotherapy": [
        "physiotherapy", "physio",
        "rehabilitation", "mobility exercise"
    ],

    "medicine": [
        "medicine", "medication",
        "tablet", "drug", "dosage"
    ],

    "doctor": [
        "doctor", "consultation",
        "appointment", "specialist"
    ],

    "first_aid": [
        "first aid", "minor injury",
        "small cut", "minor burn"
    ],

    "childcare": [
        "child", "baby", "infant",
        "paediatrician", "pediatrician",
        "vaccination"
    ],

    "mental_health": [
        "mental health", "anxiety",
        "stress", "depression",
        "feeling low", "panic"
    ],

    "reports": [
        "blood report", "medical report",
        "lab report", "test result",
        "health report"
    ],

    "symptoms": [
        "symptom", "fever", "headache",
        "cough", "pain", "vomiting",
        "dizziness", "weakness"
    ]
}


def detect_intent(message: str) -> str:
    text = message.lower()

    for intent, keywords in INTENT_KEYWORDS.items():
        if any(keyword in text for keyword in keywords):
            return intent

    return "general"


# ==========================================
# HEALTHCARE ASSISTANT
# ==========================================

def healthcare_assistant(message: str) -> dict:

    message = message.strip()

    if not message:
        return {
            "reply": "Please enter your question.",
            "intent": "general",
            "emergency": False
        }

    if len(message) > 1500:
        return {
            "reply": "Please keep your question under 1500 characters.",
            "intent": "general",
            "emergency": False
        }

    if detect_emergency(message):
        return {
            "reply": (
                "This may be a medical emergency. Please call "
                "India's emergency number 112 immediately or seek "
                "emergency medical care. Do not wait for an online "
                "response. Stay with the affected person if safe "
                "and follow the emergency operator's instructions."
            ),
            "intent": "emergency",
            "emergency": True
        }

    intent = detect_intent(message)

    return {
        "reply": KNOWLEDGE_BASE[intent],
        "intent": intent,
        "emergency": False
    }


# ==========================================
# SMART PROFESSIONAL MATCHING ENGINE
# ==========================================

def recommend_professionals(
    professionals: List[dict],
    service: str,
    city: str
) -> list:

    service = service.strip().lower()
    city = city.strip().lower()

    if not service or not city:
        return []

    recommendations = []

    for person in professionals:

        if not person.get("verified", False):
            continue

        if not person.get("available", False):
            continue

        if person.get("city", "").strip().lower() != city:
            continue

        person_services = [
            item.lower()
            for item in person.get("services", [])
        ]

        if service not in person_services:
            continue

        score = 60

        if person.get("experience", 0) >= 3:
            score += 15

        if len(person.get("skills", [])) >= 3:
            score += 10

        if person.get("rating", 0) >= 4.5:
            score += 15

        recommendations.append({
            "id": person.get("id"),
            "name": person.get("name"),
            "qualification": person.get("qualification"),
            "experience": person.get("experience"),
            "services": person_services,
            "city": person.get("city"),
            "rating": person.get("rating"),
            "match_score": min(score, 100),
            "reason": (
                "Matches the requested service and location, "
                "with verified credentials and current availability."
            )
        })

    return sorted(
        recommendations,
        key=lambda item: (
            item["match_score"],
            item["experience"] or 0,
            item["rating"] or 0
        ),
        reverse=True
    )
