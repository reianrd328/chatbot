from docx import Document

def read_doc(path):

    doc = Document(path)

    return "\n".join(
        p.text
        for p in doc.paragraphs
    )
