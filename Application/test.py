import secrets
import string

# توليد كود مميز بطول 32 حرفًا يحتوي على أحرف خاصة
alphabet = string.ascii_letters + string.digits + string.punctuation
secret_value = ''.join(secrets.choice(alphabet) for i in range(64))

# طباعة الكود المميز
print(f"Your generated secret value: {secret_value}")

# كتابة الكود المميز إلى ملف .env
with open('.env', 'a') as f:
    f.write(f"SECRET_HEADER_VALUE={secret_value}\n")

print("Secret value has been written to .env file.")
