export type Meteo = {
    main: {
        temp: number;
        feels_like: number;
        temp_min: number;
        temp_max: number;
        pressure: number;
        humidity: number;
    };
    weather: {
        id: number;
        main: string;
        description: string;
        icon: '03d'
    }[]
} 