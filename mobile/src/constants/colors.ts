export interface ColorsInterface {
    text: {
        black: string,
        white: string,
        green: string,
        lightGreen: string,
        brown: string,
        grey: string,
        lightBlue: string
    }
    black: string,
    white: string,
    green: string,
    lightGreen: string,
    brown: string,
    grey: string,
    lightBlue: string
}

export const Colors: Record<string, ColorsInterface> = {
    light: {
        text: {
            black: 'black',
            white: 'white',
            green: '#84ad65',
            lightGreen: '#90ee90',
            brown: '#8B4513',
            grey: 'grey',
            lightBlue: '#add9e6'
        },
        black: '#000',
        white: '#fff',
        green: '#84ad65',
        lightGreen: '#90ee90',
        brown: '#8B4513',
        grey: 'grey',
        lightBlue: '#add9e6'
    },
    dark: {
        text: {
            black: '#000',
            white: '#fff',
            green: '#84ad65',
            lightGreen: '#90ee90',
            brown: '#8b4513',
            grey: 'grey',
            lightBlue: '#add9e6'
        },
        black: '#000',
        white: '#fff',
        green: '#84ad65',
        lightGreen: '#90ee90',
        brown: '#8B4513',
        grey: 'grey',
        lightBlue: '#add9e6'
    }
}