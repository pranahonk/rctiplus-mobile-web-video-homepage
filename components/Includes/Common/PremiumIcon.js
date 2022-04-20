export default function PremiumIcon(props) {
  if (!props.premium) return null

  return (
    <div style={styles.container}>
      <p style={styles.text}>Premium</p>
      <div style={styles.imgWrapper}>
        <img 
          src="/icons-menu/crown_icon@3x.png" 
          alt="icon-video"
          width={12}/>
      </div>
    </div>
  )
}

const styles = {
  text: {
    color: "black",
    fontSize: "8px",
    fontStyle: "italic",
    fontWeight: "bold",
    margin: "0 3px 0 4px",
  },
  container: {
    background: "#ebce00",
    display: "flex",
    alignItems: "center",
    position: "absolute",
    justifyContent: "space-evenly",
    borderRadius: "7px 0 7px 0",
    boxShadow: "2px 2px 5px black",
  },
  imgWrapper: {
    background: "black",
    width: "20px",
    height: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "2px",
    borderRadius: "50% 0 50% 50%",
  }
}