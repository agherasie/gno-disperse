package disperse

import (
	"std"

	"gno.land/p/demo/ufmt"
	"gno.land/p/demo/grc/grc20"
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

func DisperseToken(token grc20.Token, addresses []std.Address, coins std.Coins) {
	caller := std.GetOrigCaller() // get tx sender

	var totalAmount uint64
	for _, coin := range coins {
		totalAmount += uint64(coin.Amount)
	}

	token.TransferFrom(caller, std.CurrentRealm().Addr(), totalAmount)
	for i, address := range addresses {
		for y, coin := range coins {
			if y == i {
				token.Transfer(address, uint64(coin.Amount))
			}
		}
	}
}

func Test() {
	reza := std.Address("g143f6s0wygzkzjt4jylnn5zc7sxy0cjckxlh7xq")
	alex := std.Address("g142ecm5hhnjurxrs0vm39pla6cjvfzqywn6d4wz")
	foo := grc20.NewBanker("Foo", "FOO", 4)
	foo.Mint(std.GetOrigCaller(), 1000000*10000) // @administrator (1M)
	token := foo.Token()
	ufmt.Println("moi lenny = ", token.BalanceOf(std.GetOrigCaller()))
	DisperseToken(token, []std.Address{reza, alex}, std.Coins{{foo.GetName(), 1000}, {foo.GetName(), 1000}})
	ufmt.Println("moi lenny after = ", token.BalanceOf(std.GetOrigCaller()))
	ufmt.Println("reza = ", token.BalanceOf(reza))
	ufmt.Println("alex = ", token.BalanceOf(alex))
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
