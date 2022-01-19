export const randomChartData = (size, maxValue) => {
    return new Array(size)
        .fill(0, 0, size)
        .map((a, i) => ({
            name: i.toString(),
            value: Math.floor(Math.random() * maxValue)
        }))
}

export const COLORS = ["#57a5de","#60c2c6","#69dfae","#b4d05b","#ffc107","#b6a054","#6d7fa0","#3e76b3","#0e6dc5","#3d3d6b"]