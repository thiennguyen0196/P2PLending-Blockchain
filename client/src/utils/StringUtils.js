class StringUtils {
    static formatId(id) {
        const divider = '-';
        return [id.slice(0, 5), divider, id.slice(5, 10), divider, 
            id.slice(10, 15), divider, id.slice(15, 20), 
            divider, id.slice(20, 25)].join('');
    }
}

export default StringUtils;
