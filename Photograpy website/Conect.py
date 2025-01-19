import mysql.connector
con=mysql.connector.connect(host="Localhost" ,user="root",password="Aritra@Shreeparna1234509876",database="codewitharitra" )
my_cursor=con.cursor()
con.commit()
con.close()

print("connection Succesfully ")

