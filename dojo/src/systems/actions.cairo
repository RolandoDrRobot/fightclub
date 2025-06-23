use fight_club::models::Player;

// define the interface
#[starknet::interface]
pub trait IActions<T> {
    fn create_player(ref self: T);
    fn add_score(ref self: T);
    fn subtract_score(ref self: T);
}

// dojo decorator
#[dojo::contract]
pub mod actions {
    use super::{IActions, Player};
    use starknet::{ContractAddress, get_caller_address};

    use dojo::model::{ModelStorage};
    use dojo::event::EventStorage;

    #[derive(Copy, Drop, Serde)]
    #[dojo::event]
    pub struct PlayerCreated {
        #[key]
        pub address: ContractAddress,
        pub initial_score: u32,
    }

    #[derive(Copy, Drop, Serde)]
    #[dojo::event]
    pub struct ScoreChanged {
        #[key]
        pub address: ContractAddress,
        pub new_score: u32,
        pub old_score: u32,
    }

    #[abi(embed_v0)]
    impl ActionsImpl of IActions<ContractState> {
        fn create_player(ref self: ContractState) {
            // Get the default world.
            let mut world = self.world_default();

            // Get the address of the current caller
            let player_address = get_caller_address();

            // Create a new player with score 0
            let new_player = Player {
                address: player_address,
                score: 0,
            };

            // Write the new player to the world
            world.write_model(@new_player);

            // Emit an event to notify about the new player
            world.emit_event(@PlayerCreated { address: player_address, initial_score: 0 });
        }

        fn add_score(ref self: ContractState) {
            // Get the default world.
            let mut world = self.world_default();

            // Get the address of the current caller
            let player_address = get_caller_address();

            // Retrieve the player's current data from the world
            let mut player: Player = world.read_model(player_address);
            let old_score = player.score;

            // Add 1 to the score
            player.score += 1;

            // Write the updated player to the world
            world.write_model(@player);

            // Emit an event to notify about the score change
            world.emit_event(@ScoreChanged { address: player_address, new_score: player.score, old_score });
        }

        fn subtract_score(ref self: ContractState) {
            // Get the default world.
            let mut world = self.world_default();

            // Get the address of the current caller
            let player_address = get_caller_address();

            // Retrieve the player's current data from the world
            let mut player: Player = world.read_model(player_address);
            let old_score = player.score;

            // Subtract 1 from the score (only if score > 0 to avoid underflow)
            if player.score > 0 {
                player.score -= 1;
            }

            // Write the updated player to the world
            world.write_model(@player);

            // Emit an event to notify about the score change
            world.emit_event(@ScoreChanged { address: player_address, new_score: player.score, old_score });
        }
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        /// Use the default namespace "fight_club". This function is handy since the ByteArray
        /// can't be const.
        fn world_default(self: @ContractState) -> dojo::world::WorldStorage {
            self.world(@"fight_club")
        }
    }
}
