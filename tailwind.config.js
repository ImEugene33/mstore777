module.exports = {
    mode: 'aot',
    content: [
        "./sections/**/*.{liquid,html}",  // Путь к вашим Liquid файлам в секциях
        "./assets/**/*.{js,css}",
    ],
    theme: {
        extend: {
            
        },
    },
    plugins: [],
}
