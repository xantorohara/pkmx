/*
 * Copyright (c) 2014  Xantorohara
 * Released under the MIT license
 */

/**
 * Pack elements inside the container
 * @param container - CSS selector or DOM element
 * @param elements - CSS selector or list of DOM elements
 * @param options - layout options
 * {
 * cellWidth: number,
 * cellHeight: number,
 * cellValign: top | center | bottom
 * cellHalign: left |center | right
 * optimizeSort: boolean,
 * liveAppend: boolean
 * }
 * @returns {{append: append, repack: repack}} - function to append or repack elements
 */
function pkmx(container, elements, options) {

    if (typeof container == 'string') {
        container = document.querySelector(container);
    }

    if (typeof elements == 'string') {
        elements = document.querySelectorAll(elements);
    }

    options = options || {};
    options.cellWidth = options.cellWidth || 10;
    options.cellHeight = options.cellHeight || 10;

    var matrix, columns, index;
    var elems = [];
    for (var i = 0; i < elements.length; i++) {
        elems.push(elements[i]);
    }

    function repack() {
        matrix = [];
        columns = container.clientWidth / options.cellWidth | 0;
        index = 0;

        if (options.optimizeSort) {
            elems.sort(function (a, b) {
                return (b.offsetWidth + b.offsetHeight) - (a.offsetWidth + a.offsetHeight);
            });
        }
        for (var i = 0; i < elems.length; i++) {
            _append(elems[i]);
        }

        if (!options.liveAppend) {
            matrix = null;
        }
    }

    function append(elements) {
        if (typeof elements == 'string') {
            elements = document.querySelectorAll(elements);
        }
        for (var i = 0; i < elements.length; i++) {
            elems.push(elements[i]);
            if (options.liveAppend) {
                _append(elements[i]);
            }
        }
    }

    function _append(element) {
        var elemW = element.offsetWidth;
        var elemH = element.offsetHeight;

        var sizeX = Math.ceil(elemW / options.cellWidth);
        var sizeY = Math.ceil(elemH / options.cellWidth);

        var pos = pkmx.mxAllocate(matrix, columns, sizeX, sizeY, ++index);

        if (pos) {
            var dx = 0, dy = 0;

            if (options.cellValign == 'center') {
                dy = (sizeY * options.cellHeight - elemH) / 2 | 0;
            } else if (options.cellValign == 'bottom') {
                dy = sizeY * options.cellHeight - elemH;
            }

            if (options.cellHalign == 'center') {
                dx = (sizeX * options.cellWidth - elemW) / 2 | 0;
            } else if (options.cellHalign == 'right') {
                dx = sizeX * options.cellWidth - elemW;
            }

            element.style.display = 'block';
            element.style.position = 'absolute';
            element.style.top = pos[1] * options.cellHeight + dy + 'px';
            element.style.left = pos[0] * options.cellWidth + dx + 'px';
        }
    }

    repack();

    return {
        append: append,
        repack: repack
    }
}

pkmx.rowLimit = 9999;

pkmx.mxCreateRows = function (matrix, columnsCount, rowsCount) {
    for (var iY = 0; iY < rowsCount; iY++) {
        var row = [];
        for (var iX = 0; iX < columnsCount; iX++) {
            row.push(0);
        }
        row.push(columnsCount);
        matrix.push(row);
    }
};

pkmx.mxFillBox = function (matrix, columnsCount, xPos, yPos, xLen, yLen, index) {
    if (xPos + xLen > columnsCount || yPos + yLen > matrix.length) {
        throw 'Index out of bounds';
    }
    for (var iY = 0; iY < yLen; iY++) {
        for (var iX = 0; iX < xLen; iX++) {
            matrix[yPos + iY][xPos + iX] = index;
        }
        matrix[yPos + iY][columnsCount] -= xLen;
    }
};

pkmx.mxTestBox = function (matrix, columnsCount, xPos, yPos, xLen, yLen) {
    if (xPos + xLen > columnsCount) {
        throw 'Index out of bounds';
    }
    for (var iY = 0; iY < yLen && iY + yPos < matrix.length; iY++) {
        var row = matrix[yPos + iY];
        if (row[columnsCount] < xLen) {
            return false;
        }
        for (var iX = 0; iX < xLen; iX++) {
            if (row[xPos + iX] != 0) {
                return false;
            }
        }
    }
    return true;
};

pkmx.mxAllocate = function (matrix, columnsCount, xLen, yLen, index) {
    if (xLen > 0 && yLen > 0 && xLen <= columnsCount && yLen < pkmx.rowLimit) {
        for (var iY = 0; iY < pkmx.rowLimit; iY++) {
            var row = matrix[iY];

            if (!row || row[columnsCount] >= xLen) {
                for (var iX = 0; iX <= columnsCount - xLen; iX++) {
                    if (pkmx.mxTestBox(matrix, columnsCount, iX, iY, xLen, yLen)) {
                        var rowsCount = iY + yLen - matrix.length;
                        if (rowsCount > 0) {
                            pkmx.mxCreateRows(matrix, columnsCount, rowsCount);
                        }
                        pkmx.mxFillBox(matrix, columnsCount, iX, iY, xLen, yLen, index);
                        return [iX, iY];
                    }
                }
            }
        }
    }
};
