# vike-ssr-dynamic-pages
1. npm install
2. npm run dev
3. navigate to  http://localhost:3000/dynamic/hello-world
4. Observe 404 check dynamically created folder on server ./dynamic/hello-world. It should have +Page.js file
5. Restart server
6. go to the http://localhost:3000/dynamic/hello-world it should render  a counter
7. Navigate to  any new page  e.g. http://localhost:3000/dynamic/hello-world2 
8. It return 404
9. Navigate one more time  http://localhost:3000/dynamic/hello-world2 to and it renders counter