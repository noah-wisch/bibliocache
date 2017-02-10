
module.exports = [
    {
        name: 'home',
        url: '',
        component: 'newSession',
    },
	{
        name: 'registration',
        url: '/register',
        component: 'registration',
    },
    {
        name: 'login',
        url: '/login',
        component: 'login',
    },
    {
        name: 'new-session',
        url: '/new-session', // url: '/new-session/:session_id',
        component: 'newSession',
    },
    {
        name: 'map',
        url: '/map', // url: '/map/:session_id',
        component: 'map',
    },
    {
        name: 'in-range',
        url: '/cache', // url: '/cache/:session_id',
        component: 'range',
    },
];

