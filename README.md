# Финальный проект на тему "Система рецензирования статей"

Проект представляет собой систему для управления статьями и их рецензирования. Пользователи с ролью Author могут загружать статьи, Reviewer — рецензировать их, а Admin — управлять пользователями и статьями.
Система состоит из двух основных компонентов: бэкенд (на ASP.NET) и фронтенд (на React).

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
   Это автоматически загрузит все необходимые библиотеки для бэкенда.

3. **Создайте базу данных**:
   ```sql
   CREATE DATABASE ReviewSystem;
   ```

4. **Настройте строку подключения**:
   Откройте файл `appsettings.json` и укажите строку подключения к вашей базе данных PostgreSQL:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Host=localhost;Port=5432;Database=ReviewSystem;Username=your_username;Password=your_password"
     },
   }
   ```

5. **Создайте таблицы в базе данных**:
   Примените миграции для создания таблиц:
   ```bash
   dotnet ef database update
   ```

6. **Перейдите в директорию фронтенда**:
   ```bash
   cd ../ReviewSystemFrontend
   ```

7. **Установите зависимости**:
   ```bash
   npm install
   ```
   Это автоматически загрузит все необходимые библиотеки для фронтенда.

8. **Запустите бэкенд. В директории ReviewSystemApi выполните:**:
   ```bash
   dotnet run
   ```

9. **Запустите фронтенд. В директории ReviewSystemFrontend выполните:**
   ```bash
   npm start
   ```

## Очистка базы данных
1. Подключитесь к базе данных PostgreSQL.
2. Выполнить следующие SQL-запросы для очистки таблиц:
   ```sql
   TRUNCATE TABLE "Users" RESTART IDENTITY CASCADE;
   TRUNCATE TABLE "Articles" RESTART IDENTITY CASCADE;
   TRUNCATE TABLE "Reviews" RESTART IDENTITY CASCADE;
   TRUNCATE TABLE "ReviewAssignments" RESTART IDENTITY CASCADE;
   ```

   - `TRUNCATE TABLE` удаляет все строки в таблице.
   - `RESTART IDENTITY` сбрасывает последовательности (Id) до начального значения (1).
   - `CASCADE` автоматически очищает связанные таблицы (например, удаление записей в `Articles` удалит связанные записи в `Reviews` и `ReviewAssignments`). 