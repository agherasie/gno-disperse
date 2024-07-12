package disperse

import (
	"std"

	"gno.land/p/demo/ufmt"
)

// DisperseGnot parses receivers and amounts and sends out gnot
func DisperseGnot(addresses []std.Address, coins std.Coins) {
	coinSent := std.GetOrigSend() // get Coins sent with call
	caller := std.GetOrigCaller() // get tx sender

	if len(addresses) != len(coins) {
		panic(errNumAddrValMismatch)
	}

	var totalAmount int64
	for _, coin := range coins {
		totalAmount += coin.Amount
	}
 
	// Check if total amount of coins sent is equal to total amount of coins to be sent
	if totalAmount != coinSent.AmountOf("ugnot") {
		ufmt.Println(totalAmount, coinSent.AmountOf("ugnot")) 
		panic(ErrWrongAmount)
	}

	// Get address of Disperse realm
	realmAddr := std.CurrentRealm().Addr()

	// Get Banker
	banker := std.GetBanker(std.BankerTypeOrigSend)

	// Send coins
	for i, _ := range addresses {
		banker.SendCoins(realmAddr, addresses[i], std.Coins{coins[i]})
	}

	// Return possible leftover coins
	for _, coin := range coinSent {
		leftoverAmt := banker.GetCoins(realmAddr).AmountOf(coin.Denom)
		if leftoverAmt > 0 {
			send := std.Coins{{coin.Denom, leftoverAmt}}
			banker.SendCoins(realmAddr, caller, send)
		}
	}
}

func DisperseGnotString(addresses string, amounts string) {
	parsedAddresses, err := parseAddresses(addresses)
	if err != nil {
		panic(err)
	}

	parsedAmounts, err := parseAmounts(amounts)
	if err != nil {
		panic(err)
	}

	coins := make(std.Coins, len(parsedAmounts))
	for i, amount := range parsedAmounts {
		coins[i] = std.Coin{"ugnot", amount}
	}

	DisperseGnot(parsedAddresses, coins)
}