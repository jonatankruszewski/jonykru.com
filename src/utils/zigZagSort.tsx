export const zigZagSort = (pills: string[])=> {
    const sorted = [...pills].sort((a, b) => a.length - b.length);

    const result = [];
    let left = 0, right = sorted.length - 1;
    let flip = true;

    while (left <= right) {
        if (flip) {
            result.push(sorted[right--]);
            if (left <= right) result.push(sorted[left++])
        } else {
            result.push(sorted[left++]);
            if (left <= right) result.push(sorted[right--]);
        }
        flip = !flip;
    }

    return result;
}
