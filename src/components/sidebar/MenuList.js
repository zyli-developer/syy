import MenuItem from "./MenuItem"

const MenuList = ({ items, toggleMenuItem, addMenuItem, removeMenuItem }) => {
  return (
    <nav className="py-2">
      {items.map((item) => (
        <MenuItem
          key={item.id}
          item={item}
          toggleMenuItem={toggleMenuItem}
          addMenuItem={addMenuItem}
          removeMenuItem={removeMenuItem}
        />
      ))}
    </nav>
  )
}

export default MenuList
