npm run build
rsync -avzh --exclude 'assets/*' dist/ ariksavage.com:/var/www/vhosts/books.rebeccabonarek.com/web
rsync -avzh api/ ariksavage.com:/var/www/vhosts/books.rebeccabonarek.com/web/api
