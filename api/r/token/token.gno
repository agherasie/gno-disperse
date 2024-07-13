package token

import (
	tokens "gno.land/r/demo/grc20factory"
	"gno.land/p/demo/ownable"
)

var admin *ownable.Ownable 

func init() {
	admin = ownable.NewWithAddress("g1w62226g8hykfmtuasvz80rdf0jl6phgxsphh5v") // @agherasie
	tokens.New("test", "TEST", 4, 1_000_000_000, 0)	
	tokens.Mint("TEST", admin.Owner(), 1000000*10000) // @administrator (1M)
}
