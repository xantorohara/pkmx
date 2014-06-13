var testmx = {
    printMatrix: function (matrix) {
        for (var i = 0; i < matrix.length; i++) {
            console.log(i, matrix[i].join('|'));
        }
    },

    compareMatrix: function (matrix1, matrix2) {
        if (matrix1.length != matrix2.length) {
            return false;
        }
        for (var i = 0; i < matrix1.length; i++) {
            if (matrix1[i].length != matrix2[i].length) {
                return false;
            }
            for (var j = 0; j < matrix1[i].length; j++) {
                if (matrix1[i][j] != matrix2[i][j]) {
                    return false;
                }
            }
        }
        return true;
    },

    assertMatrix: function (actualMatrix, expectedMatrix) {
        if (!testmx.compareMatrix(actualMatrix, expectedMatrix)) {
            console.error('Not equals matrixes');
            console.log('Actual Matrix:');
            testmx.printMatrix(actualMatrix);
            console.log('Expected Matrix:');
            testmx.printMatrix(expectedMatrix);
        }
    },

    testAllocateMatrix: function (matrix, columnsCount, xLen, yLen, index, expectedMatrix) {
        console.log('pkmx.mxAllocate: ', xLen, yLen, index);
        pkmx.mxAllocate(matrix, columnsCount, xLen, yLen, index);
        testmx.assertMatrix(matrix, expectedMatrix);
        console.log('end');
    }
};


(function () {
    console.log('test pkmx.mxCreateRows');

    var columns = 3;
    var matrix = [];

    pkmx.mxCreateRows(matrix, columns, 2);
    testmx.assertMatrix(matrix, [
        [0, 0, 0, 3],
        [0, 0, 0, 3]
    ]);
    console.log('ok');
}());

(function () {
    console.log('test pkmx.mxFillBox');

    var columns = 3;
    var matrix = [
        [0, 0, 0, 3],
        [0, 0, 0, 3],
        [0, 0, 0, 3]
    ];

    pkmx.mxFillBox(matrix, columns, 0, 0, 1, 1, 1);
    testmx.assertMatrix(matrix, [
        [1, 0, 0, 2],
        [0, 0, 0, 3],
        [0, 0, 0, 3]
    ]);

    pkmx.mxFillBox(matrix, columns, 1, 1, 2, 2, 2);
    testmx.assertMatrix(matrix, [
        [1, 0, 0, 2],
        [0, 2, 2, 1],
        [0, 2, 2, 1]
    ]);

    console.log('ok');
}());


(function () {
    console.log('test pkmx.mxTestBox');

    var columns = 3;
    var matrix = [];
    var result;

    result = pkmx.mxTestBox(matrix, columns, 0, 0, 2, 1);
    console.assert(result, 'Expected 1 row to create');

    result = pkmx.mxTestBox(matrix, columns, 0, 0, 1, 2);
    console.assert(result, 'Expected 2 rows to create');

    matrix = [
        [1, 0, 0, 2]
    ];

    result = pkmx.mxTestBox(matrix, columns, 0, 0, 2, 1);
    console.assert(!result, 'Test failed');

    result = pkmx.mxTestBox(matrix, columns, 1, 0, 2, 1);
    console.assert(result, 'Expected no row to create');

    result = pkmx.mxTestBox(matrix, columns, 1, 0, 2, 2);
    console.assert(result, 'Expected 1 row to create');

    result = pkmx.mxTestBox(matrix, columns, 1, 1, 2, 2);
    console.assert(result, 'Expected 2 rows to create');

    console.log('ok');
}());


(function () {
    var matrix = [];
    var columns = 3;

    {
        testmx.testAllocateMatrix(matrix, columns, 1, 1, 1, [
            [1, 0, 0, 2]
        ]);

        testmx.testAllocateMatrix(matrix, columns, 1, 1, 2, [
            [1, 2, 0, 1]
        ]);

        testmx.testAllocateMatrix(matrix, columns, 1, 1, 3, [
            [1, 2, 3, 0]
        ]);
    }
    {
        testmx.testAllocateMatrix(matrix, columns, 1, 1, 4, [
            [1, 2, 3, 0],
            [4, 0, 0, 2]
        ]);

        testmx.testAllocateMatrix(matrix, columns, 2, 1, 5, [
            [1, 2, 3, 0],
            [4, 5, 5, 0]
        ]);
    }
    {
        testmx.testAllocateMatrix(matrix, columns, 3, 1, 6, [
            [1, 2, 3, 0],
            [4, 5, 5, 0],
            [6, 6, 6, 0]
        ]);
    }
    {
        testmx.testAllocateMatrix(matrix, columns, 4, 1, 0xDEADBEEF, [
            [1, 2, 3, 0],
            [4, 5, 5, 0],
            [6, 6, 6, 0]
        ]);
    }

}());

(function () {
    var matrix = [];
    var columns = 3;

    {
        console.log('Fill columns');

        testmx.testAllocateMatrix(matrix, columns, 1, 3, 1, [
            [1, 0, 0, 2],
            [1, 0, 0, 2],
            [1, 0, 0, 2]
        ]);

        testmx.testAllocateMatrix(matrix, columns, 1, 3, 2, [
            [1, 2, 0, 1],
            [1, 2, 0, 1],
            [1, 2, 0, 1]
        ]);

        testmx.testAllocateMatrix(matrix, columns, 1, 3, 3, [
            [1, 2, 3, 0],
            [1, 2, 3, 0],
            [1, 2, 3, 0]
        ]);
    }

}());
