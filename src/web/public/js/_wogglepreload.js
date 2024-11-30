
    
    let paths = [];
    let pathsToCheck = [{ path: "", visited: [[0, 4]], currentPosition: [0, 4] }];
    while (pathsToCheck.length) {
        let path = pathsToCheck.splice(0, 1)[0];
        let nextPositions = [];
        if (path.currentPosition[0] > 0) nextPositions.push([[path.currentPosition[0] - 1, path.currentPosition[1]], "l"]);
        if (path.currentPosition[0] < 4) nextPositions.push([[path.currentPosition[0] + 1, path.currentPosition[1]], "r"]);
        if (path.currentPosition[1] > 0) nextPositions.push([[path.currentPosition[0], path.currentPosition[1] - 1], "u"]);
        if (path.currentPosition[1] < 4) nextPositions.push([[path.currentPosition[0], path.currentPosition[1] + 1], "d"]);
        for (let [p, q] of nextPositions) {
            if (path.visited.some(x => x[0] === p[0] && x[1] === p[1])) continue;
            let newPath = { path: path.path + q, visited: [...path.visited, p], currentPosition: p };
            if (p[0] === 4 && p[1] === 0) paths.push(newPath);
            else pathsToCheck.splice(0, 0, newPath);
        }
    }
    for (let path of paths) {
        path.regions = [];
        path.points = 0;
        path.edges = [];
        for (let i = 1; i < path.visited.length; i++) path.edges.push([(path.visited[i][0] + path.visited[i - 1][0]) / 2, (path.visited[i][1] + path.visited[i - 1][1]) / 2]);
        let region = [];
        let count = [];
        while (count.length < 16) {
            let i = 0.5, j = 0.5, start;
            for (i = 0.5; i < 4; i++) for (j = 0.5; j < 4; j++)
                if (count.every(x => x[0] != i || x[1] != j)) { start = [i, j]; }
            let toCheck = [start];
            while (toCheck.length) {
                let p = toCheck.splice(0, 1)[0];
                if (region.some(x => x[0] == p[0] && x[1] == p[1])) continue;
                region.push(p); if (!count.some(x => x[0] == p[0] && x[1] == p[1])) count.push(p);
                let adj = [];
                if (p[0] > 1 && !path.edges.some(x => x[0] == p[0] - 0.5 && x[1] == p[1])) adj.push([p[0] - 1, p[1]]);
                if (p[0] < 3 && !path.edges.some(x => x[0] == p[0] + 0.5 && x[1] == p[1])) adj.push([p[0] + 1, p[1]]);
                if (p[1] > 1 && !path.edges.some(x => x[0] == p[0] && x[1] == p[1] - 0.5)) adj.push([p[0], p[1] - 1]);
                if (p[1] < 3 && !path.edges.some(x => x[0] == p[0] && x[1] == p[1] + 0.5)) adj.push([p[0], p[1] + 1]);
                for (let q of adj) if (!region.some(x => x[0] == q[0] && x[1] == q[1])) toCheck.push(q);
            }
            if (region.length >= 6) path.points += 1;
            if (region.length >= 3) {
                path.points += region.length;
                path.regions.push(region);
            }
            region = [];
        }
        delete path.visited;
        delete path.edges;
        delete path.currentPosition;
        path.regions = path.regions.map(r => r.map(p => 4 * (p[1] - 0.5) + (p[0] - 0.5)));
    }
    let ret = {};
    for (let path of paths) {
        let p = path.points;
        delete path.points;
        ret[p] ??= [];
        ret[p].push(path);
    }
    data("woggle", ret);
    log("done");



    
    let ret = [];
    for (let c of "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")) {
        let fname = path("src/@main/data/words/" + c + " Words.txt");
        let list = require("fs").readFileSync(fname);
        list = list.toString().split("\n");
        for (let word of list) {
            if (!word?.length) continue;
            if (word.length < 3 || word.length > 16) continue;
            let sorted = word.split("").sort().join("");
            if (ret.includes(sorted)) continue;
            ret.push(sorted);
        }
    }
    data("wogglewords", ret);
    log("done");