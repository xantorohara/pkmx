# JavaScript library for optimal blocks layout

This library allows to arrange elements inside the container by filling the empty areas.
It is very simple and small.

In the background it uses matrix, searches and allocates appropriate areas.
Like this:

```
Initial  Box      Box      Box      Box      Box      Box   
matrix + 2x2   +  4x1   +  4x2      1x4   +  2x2   +  1x1   
00000    11000    11000    11000    11005    11665    11665 
00000    11000    11000    11000    11005    11665    11665 
00000 -> 00000 -> 22220 -> 22220 -> 22225 -> 22225 -> 22225 
00000    00000    00000    44440    44445    44445    44445 
00000    00000    00000    44440    44440    44440    44441 
```

[See demos on GitHub Pages](http://xantorohara.github.io/pkmx)

