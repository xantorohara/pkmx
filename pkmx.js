function pkmx(container, elements, options) {

    if (typeof container == 'string') {
        container = document.querySelector(container);
    }

    if (typeof elements == 'string') {
        elements = document.querySelectorAll(elements);
    }

    options = options || {};
    var cellWidth = options.cellWidth || 10;
    var cellHeight = options.cellHeight || 10;

    var matrix = [];
    var columns = 0;


    var index = 0;
    var e2 = [];

    for (var i = 0; i < elements.length; i++) {
        e2.push(elements[i]);
    }

    function repack() {
        matrix = [];
        columns = container.clientWidth / cellWidth | 0;

        if (options.optimizeSort) {
            e2.sort(function (a, b) {
                return (b.offsetWidth + b.offsetHeight) - (a.offsetWidth + a.offsetHeight);
            });
        }
        for (var i = 0; i < e2.length; i++) {
            _append(e2[i]);
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
            e2.push(elements[i]);
            if (options.liveAppend) {
                _append(elements[i]);
            }
        }
    }

    function _append(element) {
        var elemW = element.offsetWidth;
        var elemH = element.offsetHeight;

        var sizeX = Math.ceil(elemW / cellWidth);
        var sizeY = Math.ceil(elemH / cellHeight);

        var pos = pkmx.mxAllocate(matrix, columns, sizeX, sizeY, ++index);
//        console.log('pkmx steps: ', debug_perf);

        if (pos) {
            var dx = 0, dy = 0;

            if (options.cellValign == 'center') {
                dy = (sizeY * cellHeight - elemH) / 2 | 0;
            } else if (options.cellValign == 'bottom') {
                dy = sizeY * cellHeight - elemH;
            }

            if (options.cellHalign == 'center') {
                dx = (sizeX * cellWidth - elemW) / 2 | 0;
            } else if (options.cellHalign == 'right') {
                dx = sizeX * cellWidth - elemW;
            }

            element.style.display = 'block';
            element.style.position = 'absolute';
            element.style.top = pos[1] * cellHeight + dy + 'px';
            element.style.left = pos[0] * cellWidth + dx + 'px';
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

pkmx.mxTestBox = function (matrix, columns, xPos, yPos, xLen, yLen) {
    if (xPos + xLen > columns) {
        throw 'Index out of bounds';
    }
    for (var iY = 0; iY < yLen && iY + yPos < matrix.length; iY++) {
        var row = matrix[yPos + iY];
        if (row[columns] < xLen) {
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
                for (var iX = 0; iX < columnsCount; iX++) {
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
