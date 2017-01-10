

exports.seed = function ( knex, Promise ) {
    // Deletes ALL existing entries
    return knex( 'users' ).del()
        .then( function () {
            return Promise.all( [
                // Inserts seed entries
                knex( 'users' ).insert( {
                    id: 1,
                    username: 'josh',
                    admin: true,
                    email: 'josh@stormheart.net'
                } ),
                knex( 'users' ).insert( {
                    id: 2,
                    username: 'test',
                    admin: false,
                    email: 'test@example.com'
                } ),
            ] );
        } );
};