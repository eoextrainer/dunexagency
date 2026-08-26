import os

ids = [7, 8, 9, 10] + list(range(31, 61))

html_template = """<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>EOEX Profile {id} | Creative Director</title>
    <meta
      name="description"
      content="EOEX single-profile SPA for Profile {id}: profile, challenges, services, and masterclass."
    />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/profile{id}-main.jsx"></script>
  </body>
</html>"""

jsx_template = """import React from 'react';
import {{ createRoot }} from 'react-dom/client';
import ProfileOnePage from './ProfileOnePage';
import profileRaw from '../gallery/Landing-Pages/{career_file}?raw';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ProfileOnePage profileId={{id}} profileRaw={{profileRaw}} />
  </React.StrictMode>,
);"""

created_files = []
skipped_files = []

for idx ifor idx ifor idx ifor idx ifor id{idx}.html"
    jsx_path = f"src/profile{idx}-main.jsx"
    
    rotation = (idx - 1) % 3
    career_file =    AREERS-{rotation + 1}.txt"
    
                                                                              d(html_path)
    else:
        with open(html_path, 'w', encoding='ut        with open(      f        with open(html_path, 'w', encoding='ut        with open(      f        with open(html_path, 'w     f os.p  h.exists(jsx_path        with opped_files.a        with open(html_path, 'w', encoding='ut        with open( ng=   f-8') a   :
            f.write(jsx_template.format(id=idx, career_file=career_file))
        created_files.appen        created_files.appen        crated_files)} files.")
print(f"Skipped {len(skipped_files)} existing files.")
if created_files:
    print("Sample created files:")
               rted(list(set(created_files))[:6]):
        print(f" - {f}")
