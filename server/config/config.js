module.exports = {
	db1: {
		uri: 'mongodb://CENTeam3:CENTeam3@ds141633.mlab.com:41633/games_info',
	},
	db2: {
		uri: 'mongodb://CENTeam3:CENTeam3@ds141613.mlab.com:41613/events_info',

	},
	db3: {
		uri: 'mongodb://CENTeam3:CENTeam3@ds141633.mlab.com:41633/account_info',
	},
	port : process.env.PORT || 8080,
};
