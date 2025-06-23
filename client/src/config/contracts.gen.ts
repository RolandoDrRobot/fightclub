import { DojoProvider, DojoCall } from "@dojoengine/core";
import { Account, AccountInterface, BigNumberish, ByteArray } from "starknet";

export function setupWorld(provider: DojoProvider) {

	const build_achieve_achieveBeastChat_calldata = (): DojoCall => {
		return {
			contractName: "achieve",
			entrypoint: "achieve_beast_chat",
			calldata: [],
		};
	};

	const achieve_achieveBeastChat = async (snAccount: Account | AccountInterface) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_achieve_achieveBeastChat_calldata(),
				"tamagotchi",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_achieve_achieveBeastClean_calldata = (): DojoCall => {
		return {
			contractName: "achieve",
			entrypoint: "achieve_beast_clean",
			calldata: [],
		};
	};

	const achieve_achieveBeastClean = async (snAccount: Account | AccountInterface) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_achieve_achieveBeastClean_calldata(),
				"tamagotchi",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_achieve_achieveBeastFeed_calldata = (): DojoCall => {
		return {
			contractName: "achieve",
			entrypoint: "achieve_beast_feed",
			calldata: [],
		};
	};

	const achieve_achieveBeastFeed = async (snAccount: Account | AccountInterface) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_achieve_achieveBeastFeed_calldata(),
				"tamagotchi",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_achieve_achieveBeastPet_calldata = (): DojoCall => {
		return {
			contractName: "achieve",
			entrypoint: "achieve_beast_pet",
			calldata: [],
		};
	};

	const achieve_achieveBeastPet = async (snAccount: Account | AccountInterface) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_achieve_achieveBeastPet_calldata(),
				"tamagotchi",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_achieve_achieveBeastShare_calldata = (): DojoCall => {
		return {
			contractName: "achieve",
			entrypoint: "achieve_beast_share",
			calldata: [],
		};
	};

	const achieve_achieveBeastShare = async (snAccount: Account | AccountInterface) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_achieve_achieveBeastShare_calldata(),
				"tamagotchi",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_achieve_achieveBeastSleep_calldata = (): DojoCall => {
		return {
			contractName: "achieve",
			entrypoint: "achieve_beast_sleep",
			calldata: [],
		};
	};

	const achieve_achieveBeastSleep = async (snAccount: Account | AccountInterface) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_achieve_achieveBeastSleep_calldata(),
				"tamagotchi",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_achieve_achieveFlappyBeastHighscore_calldata = (score: BigNumberish): DojoCall => {
		return {
			contractName: "achieve",
			entrypoint: "achieve_flappy_beast_highscore",
			calldata: [score],
		};
	};

	const achieve_achieveFlappyBeastHighscore = async (snAccount: Account | AccountInterface, score: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_achieve_achieveFlappyBeastHighscore_calldata(score),
				"tamagotchi",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_achieve_achievePlatformHighscore_calldata = (score: BigNumberish): DojoCall => {
		return {
			contractName: "achieve",
			entrypoint: "achieve_platform_highscore",
			calldata: [score],
		};
	};

	const achieve_achievePlatformHighscore = async (snAccount: Account | AccountInterface, score: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_achieve_achievePlatformHighscore_calldata(score),
				"tamagotchi",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_achieve_achievePlayMinigame_calldata = (): DojoCall => {
		return {
			contractName: "achieve",
			entrypoint: "achieve_play_minigame",
			calldata: [],
		};
	};

	const achieve_achievePlayMinigame = async (snAccount: Account | AccountInterface) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_achieve_achievePlayMinigame_calldata(),
				"tamagotchi",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_achieve_achievePlayerNewTotalPoints_calldata = (): DojoCall => {
		return {
			contractName: "achieve",
			entrypoint: "achieve_player_new_total_points",
			calldata: [],
		};
	};

	const achieve_achievePlayerNewTotalPoints = async (snAccount: Account | AccountInterface) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_achieve_achievePlayerNewTotalPoints_calldata(),
				"tamagotchi",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_achieve_achieveScoreShare_calldata = (score: BigNumberish): DojoCall => {
		return {
			contractName: "achieve",
			entrypoint: "achieve_score_share",
			calldata: [score],
		};
	};

	const achieve_achieveScoreShare = async (snAccount: Account | AccountInterface, score: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_achieve_achieveScoreShare_calldata(score),
				"tamagotchi",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_player_addOrUpdateFoodAmount_calldata = (foodId: BigNumberish, amount: BigNumberish): DojoCall => {
		return {
			contractName: "player",
			entrypoint: "add_or_update_food_amount",
			calldata: [foodId, amount],
		};
	};

	const player_addOrUpdateFoodAmount = async (snAccount: Account | AccountInterface, foodId: BigNumberish, amount: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_player_addOrUpdateFoodAmount_calldata(foodId, amount),
				"tamagotchi",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_game_awake_calldata = (): DojoCall => {
		return {
			contractName: "game",
			entrypoint: "awake",
			calldata: [],
		};
	};

	const game_awake = async (snAccount: Account | AccountInterface) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_game_awake_calldata(),
				"tamagotchi",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_game_clean_calldata = (): DojoCall => {
		return {
			contractName: "game",
			entrypoint: "clean",
			calldata: [],
		};
	};

	const game_clean = async (snAccount: Account | AccountInterface) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_game_clean_calldata(),
				"tamagotchi",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_player_emitPlayerPushToken_calldata = (token: ByteArray): DojoCall => {
		return {
			contractName: "player",
			entrypoint: "emit_player_push_token",
			calldata: [token],
		};
	};

	const player_emitPlayerPushToken = async (snAccount: Account | AccountInterface, token: ByteArray) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_player_emitPlayerPushToken_calldata(token),
				"tamagotchi",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_game_feed_calldata = (foodId: BigNumberish): DojoCall => {
		return {
			contractName: "game",
			entrypoint: "feed",
			calldata: [foodId],
		};
	};

	const game_feed = async (snAccount: Account | AccountInterface, foodId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_game_feed_calldata(foodId),
				"tamagotchi",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_game_getBeastAge_calldata = (): DojoCall => {
		return {
			contractName: "game",
			entrypoint: "get_beast_age",
			calldata: [],
		};
	};

	const game_getBeastAge = async (snAccount: Account | AccountInterface) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_game_getBeastAge_calldata(),
				"tamagotchi",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_game_getBeastAgeWithAddress_calldata = (address: string): DojoCall => {
		return {
			contractName: "game",
			entrypoint: "get_beast_age_with_address",
			calldata: [address],
		};
	};

	const game_getBeastAgeWithAddress = async (snAccount: Account | AccountInterface, address: string) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_game_getBeastAgeWithAddress_calldata(address),
				"tamagotchi",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_game_getTimestampBasedStatus_calldata = (): DojoCall => {
		return {
			contractName: "game",
			entrypoint: "get_timestamp_based_status",
			calldata: [],
		};
	};

	const game_getTimestampBasedStatus = async (snAccount: Account | AccountInterface) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_game_getTimestampBasedStatus_calldata(),
				"tamagotchi",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_game_getTimestampBasedStatusWithAddress_calldata = (address: string): DojoCall => {
		return {
			contractName: "game",
			entrypoint: "get_timestamp_based_status_with_address",
			calldata: [address],
		};
	};

	const game_getTimestampBasedStatusWithAddress = async (snAccount: Account | AccountInterface, address: string) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_game_getTimestampBasedStatusWithAddress_calldata(address),
				"tamagotchi",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_game_pet_calldata = (): DojoCall => {
		return {
			contractName: "game",
			entrypoint: "pet",
			calldata: [],
		};
	};

	const game_pet = async (snAccount: Account | AccountInterface) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_game_pet_calldata(),
				"tamagotchi",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_game_play_calldata = (): DojoCall => {
		return {
			contractName: "game",
			entrypoint: "play",
			calldata: [],
		};
	};

	const game_play = async (snAccount: Account | AccountInterface) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_game_play_calldata(),
				"tamagotchi",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_game_revive_calldata = (): DojoCall => {
		return {
			contractName: "game",
			entrypoint: "revive",
			calldata: [],
		};
	};

	const game_revive = async (snAccount: Account | AccountInterface) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_game_revive_calldata(),
				"tamagotchi",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_game_sleep_calldata = (): DojoCall => {
		return {
			contractName: "game",
			entrypoint: "sleep",
			calldata: [],
		};
	};

	const game_sleep = async (snAccount: Account | AccountInterface) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_game_sleep_calldata(),
				"tamagotchi",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_game_spawnBeast_calldata = (specie: BigNumberish, beastType: BigNumberish): DojoCall => {
		return {
			contractName: "game",
			entrypoint: "spawn_beast",
			calldata: [specie, beastType],
		};
	};

	const game_spawnBeast = async (snAccount: Account | AccountInterface, specie: BigNumberish, beastType: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_game_spawnBeast_calldata(specie, beastType),
				"tamagotchi",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_player_spawnPlayer_calldata = (): DojoCall => {
		return {
			contractName: "player",
			entrypoint: "spawn_player",
			calldata: [],
		};
	};

	const player_spawnPlayer = async (snAccount: Account | AccountInterface) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_player_spawnPlayer_calldata(),
				"tamagotchi",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_game_updateBeast_calldata = (): DojoCall => {
		return {
			contractName: "game",
			entrypoint: "update_beast",
			calldata: [],
		};
	};

	const game_updateBeast = async (snAccount: Account | AccountInterface) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_game_updateBeast_calldata(),
				"tamagotchi",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_player_updatePlayerDailyStreak_calldata = (): DojoCall => {
		return {
			contractName: "player",
			entrypoint: "update_player_daily_streak",
			calldata: [],
		};
	};

	const player_updatePlayerDailyStreak = async (snAccount: Account | AccountInterface) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_player_updatePlayerDailyStreak_calldata(),
				"tamagotchi",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_player_updatePlayerMinigameHighestScore_calldata = (points: BigNumberish, minigameId: BigNumberish): DojoCall => {
		return {
			contractName: "player",
			entrypoint: "update_player_minigame_highest_score",
			calldata: [points, minigameId],
		};
	};

	const player_updatePlayerMinigameHighestScore = async (snAccount: Account | AccountInterface, points: BigNumberish, minigameId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_player_updatePlayerMinigameHighestScore_calldata(points, minigameId),
				"tamagotchi",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_player_updatePlayerTotalPoints_calldata = (points: BigNumberish): DojoCall => {
		return {
			contractName: "player",
			entrypoint: "update_player_total_points",
			calldata: [points],
		};
	};

	const player_updatePlayerTotalPoints = async (snAccount: Account | AccountInterface, points: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_player_updatePlayerTotalPoints_calldata(points),
				"tamagotchi",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};



	return {
		achieve: {
			achieveBeastChat: achieve_achieveBeastChat,
			buildAchieveBeastChatCalldata: build_achieve_achieveBeastChat_calldata,
			achieveBeastClean: achieve_achieveBeastClean,
			buildAchieveBeastCleanCalldata: build_achieve_achieveBeastClean_calldata,
			achieveBeastFeed: achieve_achieveBeastFeed,
			buildAchieveBeastFeedCalldata: build_achieve_achieveBeastFeed_calldata,
			achieveBeastPet: achieve_achieveBeastPet,
			buildAchieveBeastPetCalldata: build_achieve_achieveBeastPet_calldata,
			achieveBeastShare: achieve_achieveBeastShare,
			buildAchieveBeastShareCalldata: build_achieve_achieveBeastShare_calldata,
			achieveBeastSleep: achieve_achieveBeastSleep,
			buildAchieveBeastSleepCalldata: build_achieve_achieveBeastSleep_calldata,
			achieveFlappyBeastHighscore: achieve_achieveFlappyBeastHighscore,
			buildAchieveFlappyBeastHighscoreCalldata: build_achieve_achieveFlappyBeastHighscore_calldata,
			achievePlatformHighscore: achieve_achievePlatformHighscore,
			buildAchievePlatformHighscoreCalldata: build_achieve_achievePlatformHighscore_calldata,
			achievePlayMinigame: achieve_achievePlayMinigame,
			buildAchievePlayMinigameCalldata: build_achieve_achievePlayMinigame_calldata,
			achievePlayerNewTotalPoints: achieve_achievePlayerNewTotalPoints,
			buildAchievePlayerNewTotalPointsCalldata: build_achieve_achievePlayerNewTotalPoints_calldata,
			achieveScoreShare: achieve_achieveScoreShare,
			buildAchieveScoreShareCalldata: build_achieve_achieveScoreShare_calldata,
		},
		player: {
			addOrUpdateFoodAmount: player_addOrUpdateFoodAmount,
			buildAddOrUpdateFoodAmountCalldata: build_player_addOrUpdateFoodAmount_calldata,
			emitPlayerPushToken: player_emitPlayerPushToken,
			buildEmitPlayerPushTokenCalldata: build_player_emitPlayerPushToken_calldata,
			spawnPlayer: player_spawnPlayer,
			buildSpawnPlayerCalldata: build_player_spawnPlayer_calldata,
			updatePlayerDailyStreak: player_updatePlayerDailyStreak,
			buildUpdatePlayerDailyStreakCalldata: build_player_updatePlayerDailyStreak_calldata,
			updatePlayerMinigameHighestScore: player_updatePlayerMinigameHighestScore,
			buildUpdatePlayerMinigameHighestScoreCalldata: build_player_updatePlayerMinigameHighestScore_calldata,
			updatePlayerTotalPoints: player_updatePlayerTotalPoints,
			buildUpdatePlayerTotalPointsCalldata: build_player_updatePlayerTotalPoints_calldata,
		},
		game: {
			awake: game_awake,
			buildAwakeCalldata: build_game_awake_calldata,
			clean: game_clean,
			buildCleanCalldata: build_game_clean_calldata,
			feed: game_feed,
			buildFeedCalldata: build_game_feed_calldata,
			getBeastAge: game_getBeastAge,
			buildGetBeastAgeCalldata: build_game_getBeastAge_calldata,
			getBeastAgeWithAddress: game_getBeastAgeWithAddress,
			buildGetBeastAgeWithAddressCalldata: build_game_getBeastAgeWithAddress_calldata,
			getTimestampBasedStatus: game_getTimestampBasedStatus,
			buildGetTimestampBasedStatusCalldata: build_game_getTimestampBasedStatus_calldata,
			getTimestampBasedStatusWithAddress: game_getTimestampBasedStatusWithAddress,
			buildGetTimestampBasedStatusWithAddressCalldata: build_game_getTimestampBasedStatusWithAddress_calldata,
			pet: game_pet,
			buildPetCalldata: build_game_pet_calldata,
			play: game_play,
			buildPlayCalldata: build_game_play_calldata,
			revive: game_revive,
			buildReviveCalldata: build_game_revive_calldata,
			sleep: game_sleep,
			buildSleepCalldata: build_game_sleep_calldata,
			spawnBeast: game_spawnBeast,
			buildSpawnBeastCalldata: build_game_spawnBeast_calldata,
			updateBeast: game_updateBeast,
			buildUpdateBeastCalldata: build_game_updateBeast_calldata,
		},
	};
}
