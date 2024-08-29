

public/
  Anything that is static or semi-static
  svg files, images, static JSON files, HTML
  public/index.html
    - Then here import your main.tsx/index.tsx (what creates the react app)
  public/index.css
  public/vite.svg


app/            <-- The react app with views, using queries, etc.
src/ as app/
src/consts      <-- If you need to define some constants to re-use
src/components  <-- Do you want to have all TSX components here?

src/pages/
    Home.tsx        <-- Pages  top-level and organising/showing                content. Not re-usable
    Playlists.tsx
src/components
    PlayWidget.tsx <-- Smaller components you can reuse

src/api
src/utils

lib/            <-- Re-usable stuff or generic stuff
                <-- Somebody will make a similar app, but not yours, 
                    stuff that they could just import and re-use
