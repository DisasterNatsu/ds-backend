# This is the backend for a comic reading app that uses multer to handle files and backblaze


## MySql Tables
This project doesn't use any orm, I'll soon make another project with typescript and prisma for better and more understandable code

Please check the .env.example file for the enviornment variable you need to set up the project


# What you need to set up the project

1. Clone the project

2. Install the dependencies by running `npm install`

3. Set up your mysql server

### Comics Table Code

```
CREATE TABLE comics(id varchar(255) NOT NULL, ComicTitle varchar(255) NOT NULL, Description longtext NOT NULL, CoverImage varchar(255) NOT NULL, Origin varchar(255) NOT NULL, Status varchar(255) NOT NULL, Genres varchar(255) NOT NULL, Author varchar(255), Artist varchar(255), Badges varchar(255), Date datetime default current_timestamp, PRIMARY KEY(id));
```

### Chapters Table Code

```
CREATE TABLE chapters(chapterID INT NOT NULL, ComicTitle varchar(255), comicID varchar(255) NOT NULL, ChapterNumber varchar(255) NOT NULL, ChapterName varchar(255), pages LONGTEXT NOT NULL, chapterDate datetime default current_timestamp, Primary Key(chapterID));
```

### Users Table Code

```
Create Table admin(id INT NOT NULL AUTO_INCREMENT, Email varchar(100) NOT NULL, UserName varchar(100) NOT NULL, Password varchar(255) NOT NULL, Primary Key(id));
```

4. Run the project by running `npm start`



I'm using backBlaze for storage. If you want to use local storage you can use node.js fs module to handle the files and store them in the public directory and serve from local
