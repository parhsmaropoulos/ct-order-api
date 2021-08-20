{
  /* <Table>
  <TableHead>
    {props.selectedCategory === "Εισερχόμενες" ? (
      <TableRow>
        <TableCell align="left">Ώρα</TableCell>
        <TableCell align="left">Στοιχεία Πελάτη</TableCell>
        <TableCell align="left">Διεύθυνση</TableCell>
        <TableCell align="left">Προϊόντα</TableCell>
        <TableCell align="left">Ενέργειες</TableCell>
      </TableRow>
    ) : props.selectedCategory === "Ετοιμάζονται" ? (
      <TableRow> */
  /* <TableCell align="left">Ώρα</TableCell>
              <TableCell align="left">Στοιχεία Πελάτη</TableCell>
              <TableCell align="left">Διεύθυνση</TableCell>
              <TableCell align="left">Προϊόντα</TableCell>
              <TableCell align="left">Κατάσταση</TableCell> */
  /* </TableRow>
    ) : props.selectedCategory === "Ολοκληρώθηκαν" ? (
      <TableRow>
        <TableCell align="left">Ώρα</TableCell>
        <TableCell align="left">Στοιχεία Πελάτη</TableCell>
        <TableCell align="left">Διεύθυνση</TableCell>
        <TableCell align="left">Προϊόντα</TableCell>
        <TableCell align="left">Κατάσταση</TableCell>
      </TableRow>
    ) : null}
  </TableHead>
  <TableBody>
    {props.selectedCategory === "Εισερχόμενες" &&
    props.orders.pending_orders !== undefined
      ? props.orders.pending_orders.map((order, index) => {
          console.log(order);
          return (
            <TableRow key={index}> */
  /* <TableCell align="left">
                      {order.create_at.slice(11, 19)}
                    </TableCell>
                    <TableCell align="left">
                      <ListItem>Όνομα: {order.user_details.Name}</ListItem>
                      <ListItem>Επίθετο: {order.user_details.Surname}</ListItem>
                      <ListItem>Τηλέφωνο: {order.user_details.Phone}</ListItem>
                    </TableCell>
                    <TableCell align="left">
                      <ListItem>
                        Διεύθυνση: {order.user_details.Address.address_name}{" "}
                        {order.user_details.Address.address_number}
                      </ListItem>
                      <ListItem>
                        Περιοχή: {order.user_details.Address.area_name}
                      </ListItem>
                      <ListItem>
                        Πόλη: {order.user_details.Address.city_name}
                      </ListItem>
                      <ListItem>
                        Τ.Κ.: {order.user_details.Address.zipcode}
                      </ListItem>
                    </TableCell>
                    <TableCell align="left">
                      {order.products.map((product, index) => {
                        return (
                          <ListItem key={index}> {product.item.name}</ListItem>
                        );
                      })}
                    </TableCell>
                    <TableCell align="left">
                      <TextField
                        id="timer-set"
                        select
                        label="Χρόνος"
                        value={time}
                        onChange={setTime}
                      >
                        {timeOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                      <Button
                        id={`accept_buton_${index}`}
                        onClick={() => dispatch(accept_order(order, time))}
                      >
                        {" "}
                        Accept
                      </Button>
                      <Button
                        id={`reject_buton_${index}`}
                        onClick={() => dispatch(reject_order(order, time))}
                      >
                        {" "}
                        Reject
                      </Button>
                    </TableCell> */
  /* </TableRow>
          );
        })
      : props.selectedCategory === "Ετοιμάζονται" &&
        props.orders.accepted_orders !== undefined
      ? props.orders.accepted_orders.map((order, index) => {
          // console.log(order);
          return (
            <TableRow key={index} className={classes.orderRow}> */
  /* <TableCell align="left">
                      {order.create_at.slice(11, 19)}
                    </TableCell>

                    <TableCell align="left">
                      <ListItem>Όνομα: {order.user_details.Name}</ListItem>
                      <ListItem>Επίθετο: {order.user_details.Surname}</ListItem>
                      <ListItem>Τηλέφωνο: {order.user_details.Phone}</ListItem>
                    </TableCell>
                    <TableCell align="left">
                      <ListItem>
                        Διεύθυνση: {order.user_details.Address.address_name}{" "}
                        {order.user_details.Address.address_number}
                      </ListItem>
                      <ListItem>
                        Περιοχή: {order.user_details.Address.area_name}
                      </ListItem>
                      <ListItem>
                        Πόλη: {order.user_details.Address.city_name}
                      </ListItem>
                      <ListItem>
                        Τ.Κ.: {order.user_details.Address.zipcode}
                      </ListItem>
                    </TableCell>
                    <TableCell align="left">
                      {order.products.map((product, index) => {
                        return (
                          <ListItem key={index}>
                            {" "}
                            - {product.item.name}
                          </ListItem>
                        );
                      })}
                    </TableCell>
                    <TableCell align="right">
                      {order.canceled === true ? (
                        <span>Canceled</span>
                      ) : (
                        <span>Accepted</span>
                      )}
                      <Button
                        id={`complete_buton_${index}`}
                        onClick={() => dispatch(complete_order(order.id))}
                      >
                        Complete
                      </Button>
                    </TableCell> */
  /* <OrderProductsRow products={order.products} /> */
  /* </TableRow>
          );
        })
      : props.selectedCategory === "Ολοκληρώθηκαν" &&
        props.orders.finished_orders !== undefined
      ? props.orders.finished_orders.map((order, index) => {
          // console.log(order);
          return (
            <TableRow key={index}> */
  /* <TableCell align="left">
                      {order.create_at.slice(11, 19)}
                    </TableCell>
                    <TableCell align="left">
                      <ListItem>Όνομα: {order.user_details.Name}</ListItem>
                      <ListItem>Επίθετο: {order.user_details.Surname}</ListItem>
                      <ListItem>Τηλέφωνο: {order.user_details.Phone}</ListItem>
                    </TableCell>
                    <TableCell align="right">
                      <ListItem>
                        Διεύθυνση: {order.user_details.Address.address_name}{" "}
                        {order.user_details.Address.address_number}
                      </ListItem>
                      <ListItem>
                        Περιοχή: {order.user_details.Address.area_name}
                      </ListItem>
                      <ListItem>
                        Πόλη: {order.user_details.Address.city_name}
                      </ListItem>
                      <ListItem>
                        Τ.Κ.: {order.user_details.Address.zipcode}
                      </ListItem>
                    </TableCell>
                    <TableCell align="right">
                      {order.products.map((product, index) => {
                        return (
                          <ListItem key={index}>{product.item.name}</ListItem>
                        );
                      })}
                    </TableCell>
                    <TableCell align="right">Ολοκληρωμένη</TableCell> */
  /* </TableRow>
          );
        })
      : null}
  </TableBody>
</Table>; */
}
