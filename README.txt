Drop these TTF files into this folder (exact filenames matter — they're referenced from index.html):

  BishwaCalligraphy.ttf     — for couple names
  AMSGanesha.ttf            — for the main title "शुभ विवाह"
  AMSChandrakant.ttf        — for section headers

Download sources:
  Bishwa Calligraphy:  https://barala.com.np/nepali-fonts/Bishwa-Calligraphy-font/
  AMS Ganesha:         https://indiafont.in/fonts/ams-ganesha/
  AMS Chandrakant:     https://indiafont.in/fonts/ams-chandrakant/

The page still works without these files — it falls back to Yatra One / Tiro
Devanagari Sanskrit (Google Fonts). The calligraphy faces just won't render
until the TTFs are in place.

If the filenames differ after you download (e.g. "AMS Ganesha.ttf" with a
space), either rename them to the names above OR update the @font-face
src: url(...) lines in index.html to match.
