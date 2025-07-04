import fitz  # PyMuPDF
import docx
from typing import Union


def extract_text_from_pdf(file_bytes: Union[bytes, bytearray]) -> str:
    """Extracts plain text from a PDF file (from bytes)."""
    text = ""
    with fitz.open(stream=file_bytes, filetype="pdf") as doc:
        for page in doc:
            text += page.get_text()
    return text


def extract_text_from_docx(file_path: str) -> str:
    """Extracts text from a .docx file (from path)."""
    doc = docx.Document(file_path)
    return "\n".join(p.text for p in doc.paragraphs)


def extract_text(file: any, filename: str) -> str:
    """Unified extractor: accepts UploadFile or raw file path."""
    if filename.endswith(".pdf"):
        return extract_text_from_pdf(file.read())
    elif filename.endswith(".docx"):
        return extract_text_from_docx(file.name)
    else:
        raise ValueError("Unsupported file type. Only .pdf and .docx are allowed.")
