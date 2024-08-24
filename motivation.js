
const mottos = {
	"A": ["Avoid negative sources, peoples, places, things, and bad habits"],
	"B": ["Believe in yourself"],
	"C": ["Consider things from every angle"],
	"D": ["Don't give up and Don't give in. Don't let a damn thing get you down"],
	"E": ["Enjoy life today. Yesterday is gone and tomorrow will never come."],
	"F": ["Family and friends are hidden treasures. Talk to them and enjoy their riches"],
	"G": ["Give more than you plan to get each day"],
	"H": ["Hang onto your dream."],
	"I": ["Ignore the bullshit."],
	"J": ["Just do it."],
	"K": ["Keep on trying no matter how hard it may seem. It will get easier."],
	"L": ["Love yourself first."],
	"M": ["Make it happen."],
	"N": ["Never let 'em see you sweat."],
	"O": ["Open your eyes and see everything around you."],
	"P": ["Practice makes perfect."],
	"Q": ["Quitters never win. Winners never quit."],
	"R": ["Read, learn, study about everything important in your life."],
	"S": ["Stop procrastinating."],
	"T": ["Take control of your own destiny."],
	"U": ["Understand yourself first so that you can better understand others."],
	"V": ["Visualize and strategize."],
	"W": ["Want it more than anything."],
	"X": ["X marks the spot. Mark your spot in the world."],
	"Y": ["You are unique in what you bring to this world. No one can replace you."],
	"Z": ["Zero in on your target and GO FOR IT."],
};

/**
 * 65 - 90
 * @param numericalDay
 */
export default (numericalDay) => {
	const offset = 65;
	const mod = numericalDay % 26;
	const charCode = offset + mod;
	const char = String.fromCharCode(charCode);
	const charClassIndex = 0;
	return mottos[char][charClassIndex];
};
