function* algorithm() {

    //=Initialize, the number of items we are going search and an array to hold tem
    var n = 20,
        N = n * n,
        A = [];

    // get bounds of surface we are displayed on
    var bounds = algo.BOUNDS.inflate(-4, -4)

    // derive tile size from surface size and word length
    var kW = bounds.w / n,
        kH = bounds.h / n;

    // we only need a simple single row grid
    var layout = new algo.layout.GridLayout(bounds, n, n);

    // make an element for each value in the array and make a random number
    var D = 5,
        R = Math.floor(Math.random() * D);
    for (var row = 0; row < n; row += 1) {
        for (var col = 0; col < n; col += 1) {
            var box = layout.getBox(row, col).inflate(-2, -2);
            A.push({
                value: R,
                element: new algo.render.Rectangle({
                    shape: box,
                    text: R,
                    fontSize: 16
                })
            });

            R += Math.max(1, Math.floor(Math.random() * D));
        }
    }

    // get a random value to look for
    var TARGET = _.random(0, A.length);

    A[TARGET].element.set({
        cornerRadius: '100%'
    });

    yield ({
        step: _.sprintf("Lets start with %d items, sorted. We will search for the value %d", N, A[TARGET].value),
        line: "Initialize"
    });

    // These are pivotal variables for the algorithm. They track the part of the array we are examining
    var LEFT = 0,
        RIGHT = N - 1,
        M1, M2;

    // highlight the current range based on LEFT, RIGHT, MIDDLE
    function showRange() {

        for (var i = 0; i < N; i += 1) {

            var state = algo.render.kS_GRAY;

            if (i >= LEFT && i <= RIGHT) {
                state = algo.render.kS_BLUE;
            }
            if (i === LEFT || i === RIGHT) {
                state = algo.render.kS_RED;
            }
            if (i === M1 || i === M2) {
                state = algo.render.kS_GREEN;
            }
            A[i].element.set({
                state: state
            });
        }
    }

    // now the algorithm itself proceeds until we find the value
    var operations = 0;
    while (LEFT <= RIGHT) {
        operations += 1;
        M1 = Math.trunc(LEFT + (RIGHT - LEFT) / 3);
        M2 = Math.trunc(LEFT + (2 * (RIGHT - LEFT) / 3));
        showRange();
        yield ({
            step: _.sprintf("Examining from %d, to %d. The middle values are %d and %d", LEFT, RIGHT, A[M1].value, A[M2].value),
            line: "candidate",
            variables: {
                TARGET_VAL: A[TARGET].value,
                TARGET_INDEX: TARGET,
                LEFT: LEFT,
                MIDDLE1: M1,
                MIDDLE2: M2,
                RIGHT: RIGHT
            }
        });
        //=found
        if (A[M1].value === A[TARGET].value || A[M2].value === A[TARGET].value) {
            break;
        }
        // now we determine where to look in the array
        if (A[TARGET].value < A[M1].value) {

            RIGHT = M1 - 1;

        } else if (A[TARGET].value > A[M2].value) {

            LEFT = M2 + 1;

        } else {

            LEFT = M1 + 1;
            RIGHT = M2 - 1;

        }
    }

    // change state of everything except the target element
    algo.render.Element.set({
        state: algo.render.kS_FADED
    }, _.map(_.without(A, A[TARGET]), function(item) {
        return item.element
    }));

    yield ({
        step: _.sprintf("The value was found at index %d, which required %d operations", TARGET, operations),
        line: "found",
        variables: {
            Operations: operations
        }
    });
} 
