# 🎫 Сибинтек Софт — Классификатор тикетов

Система автоматической классификации тикетов поддержки на базе ML.

## 🚀 Деплой на Render

1. Создайте репозиторий на GitHub и залейте код
2. Зарегистрируйтесь на [render.com](https://render.com)
3. Создайте новый Web Service → Connect your GitHub repo
4. Render автоматически обнаружит `render.yaml`
5. Нажмите **Create Web Service**

> ⚠️ Бесплатный тариф: 512 МБ RAM, модель может не поместиться.  
> Для full-функциональности используйте платный тариф ($7/мес) или дообучите модель локально.

## 🖥️ Локальный запуск

```bash
# Клонировать
git clone <repo-url>
cd ticket-classifier

# Установить зависимости
cd backend
pip install -r requirements.txt

# (Опционально) Дообучить модель
python train.py

# Запустить
# Windows:
run.bat
# Linux/Mac:
cd backend && uvicorn main:app --reload --host 0.0.0.0 --port 8000