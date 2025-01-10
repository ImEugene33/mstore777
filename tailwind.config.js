module.exports = {
    mode: 'aot',
    safelist: ['bg-green-500', 'text-white', 'py-2', 'p-5', 'rounded'],
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
