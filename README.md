# Інструкція для веб-додатку

1.  Відкрий репозиторій на гітхабі
2.  Зміни гілку розробки на develop та натисни кнопку Code
3.  Завантаж архів проекту та разархівуй його
4.  Відкрий цю папку в твоєму Visual Studio Code
5.  Створи термінал та напиши команду npm start

Сайт запустився, однак проблема що наша БД не запустилася, зараз вирішимо цю проблему

# Інструкція для БД

1.  Відкрий свій PostgreSQL
2.  Створи нову БД (ПКМ на Databases), рекоментую називати як в мене mydatabase
3.  В новоствореній БД перейди до Schemas
4.  Створи нову схему (ПКМ на Schemas) та назви її exploitation
5.  Переходим по лінку та завантажуємо файл-бекап нашої БД (https://drive.google.com/file/d/1j5gdt62JGTDGTegvBjxpWWuW7b8y-zBy/view?usp=sharing)
6.  Повертаємось до нашого PostgreSQL і тиснемо ПКМ на mydatabase
7.  Обераємо Restore та у полі Filename шукаємо наш файл-бекап
8.  Налаштовуємо у 2й та 3й вкладці Sections та Options (виставляємо всі прапорці у цих пункатах) та тиснемо на Restore кнопку
9.  Після закінчення процесу ми побачимо що у нас створилися та автоматично наповнилися наші таблиці всім чим нам потрібно
10.  Переходимо до Visual Studio Code та створюємо ще один термінал та прописуємо команду node server.js
11.  Якщо у консолі ми бачимо Server is running on port 3001 то переходимо до нашого веб-додатку та перезавантажуємо його щоб данні сайту оновилися


Щоб облегчити користування додатком я працюю над налаштуванням Docker який буде робити все сам однією командою, поки що працюємо так
