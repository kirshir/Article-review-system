# Финальный проект на тему "Система рецензирования статей"

Проект представляет собой систему для управления статьями и их рецензирования. Пользователи с ролью Author могут загружать статьи, Reviewer — рецензировать их, а Admin — управлять пользователями и статьями.

## Очистка базы данных
1. Подключитесь к базе данных PostgreSQL.
2. Выполнить следующие SQL-запросы для очистки таблиц:
   ```sql
   TRUNCATE TABLE "Users" RESTART IDENTITY CASCADE;
   ```

   И если потребуется:
   ```sql
   TRUNCATE TABLE "Articles" RESTART IDENTITY CASCADE;
   TRUNCATE TABLE "Reviews" RESTART IDENTITY CASCADE;
   TRUNCATE TABLE "ReviewAssignments" RESTART IDENTITY CASCADE;
   ```

   - `TRUNCATE TABLE` удаляет все строки в таблице.
   - `RESTART IDENTITY` сбрасывает последовательности (Id) до начального значения (1).
   - `CASCADE` автоматически очищает связанные таблицы (например, удаление записей в `Articles` удалит связанные записи в `Reviews` и `ReviewAssignments`).

## Настройка проекта

### Шаги
1. **Клонируйте репозиторий**:
   ```bash
   git clone <URL_репозитория>
   cd ReviewSystemApi
   ```

2. **Установите зависимости**:
   ```bash
   dotnet restore
   ```
   Это автоматически загрузит все необходимые библиотеки

3. **Создайте базу данных**:
   ```sql
   CREATE DATABASE ReviewSystemDb;
   ```

4. **Настройте строку подключения**:
   Откройте файл `appsettings.json` и укажите строку подключения к вашей базе данных PostgreSQL:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Host=localhost;Port=5432;Database=ReviewSystemDb;Username=your_username;Password=your_password"
     },
   }
   ```

5. **Создайте таблицы в базе данных**:
   Примените миграции для создания таблиц:
   ```bash
   dotnet ef database update
   ```

6. **Запустите бэкенд**:
   ```bash
   dotnet run
   ```