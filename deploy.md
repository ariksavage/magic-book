npm run build
# exclude mp3s, etc
rsync -avzh --exclude 'assets/*' dist/ ariksavage.com:/var/www/vhosts/books.rebeccabonarek.com/web

# include all assets
rsync -avzh dist/ ariksavage.com:/var/www/vhosts/books.rebeccabonarek.com/web

# update api
rsync -avzh api/ ariksavage.com:/var/www/vhosts/books.rebeccabonarek.com/web/api
