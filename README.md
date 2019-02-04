# JavaScript library for optimal blocks layout

This library allows to arrange elements inside the container by filling the empty areas.
It is very simple and small.

In the background it uses matrix with dynamic height, does search and allocates appropriate areas.
Like this:

```
Initial   Box      Box      Box      Box      Box   
empty  +  2x2   +  4x1   +  4x2      1x5   +  2x2 
matrix 
         11000 -> 11000 -> 11000 -> 11005 -> 11665 
         11000    11000    11000    11005    11665 
                  22220    22220    22225    22225 
                           44440    44445    44445 
                           44440    44445    44445 
```

[See demos on GitHub Pages](http://xantorohara.github.io/pkmx/)
- [Example 1](http://xantorohara.github.io/pkmx/examples/example1.html)
- [Example 2](http://xantorohara.github.io/pkmx/examples/example2.html)

