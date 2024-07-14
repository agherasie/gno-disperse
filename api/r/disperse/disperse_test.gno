package disperse

import (
	"testing"
	"std"

	"gno.land/p/demo/testutils"
	"gno.land/p/demo/ufmt"
	"gno.land/p/demo/urequire"
	tokens "gno.land/r/demo/grc20factory"
)

func TestDisperseGnot(t *testing.T) {
	var (
		alice = testutils.TestAddress("alice")
		bob   = testutils.TestAddress("bob")
		carol = testutils.TestAddress("carol")
	)

	// Get Banker
	banker := std.GetBanker(std.BankerTypeOrigSend) 

	sent := std.Coins{{"ugnot", 200}} 
	std.TestSetOrigSend(sent, nil)
	std.TestIssueCoins(alice, std.Coins{{"ugnot", 1_000}})
	std.TestSetOrigCaller(alice) 

	// Create coins to disperse
	coins := std.Coins{{"ugnot", 100}, {"ugnot", 100}}
 
	// Disperse coins
	DisperseGnot([]std.Address{bob, carol}, coins)
 
	// Check if coins were dispersed
	bobBalance := banker.GetCoins(bob).AmountOf("ugnot") 
	urequire.Equal(t, bobBalance, int64(100))
	carolBalance := banker.GetCoins(carol).AmountOf("ugnot")
	urequire.Equal(t, carolBalance, int64(100))
}