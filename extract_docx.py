import zipfile
import xml.etree.ElementTree as ET

files = [
    "gallery/Landing-Pages/CAREERS-1.docx",
    "gallery/Landing-Pages/CAREERS-2.docx",
    "gallery/Landing-Pages/CAREERS-3.docx",
    "gallery/Landing-Pages/EOEX FashionTech Research.docx",
    "gallery/Landing-Pages/EOEX Landing Pages Code.docx"
]

for docx_path in files:
    txt_path = docx_path.replace(".docx", ".txt")
    try:
        with zipfile.ZipFile(docx_path) as z:
            doc_xml = z.read('word/document.xml')
            root = ET.fromstring(doc_xml)
            namespaces = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
            paragraphs = root.findall('.//w:p', namespaces)
            lines = []
            for p in paragraphs:
                texts = p.findall('.//w:t', namespaces)
                p_text = "".join([t.text for t in texts if t.text])
                lines.append(p_text)
            with open(txt_path, 'w', encoding='utf-8') as f:
                f.write("                f.write("     ri           sed                 f.write("        
           E           E           E           E     x_path}: {e}")
