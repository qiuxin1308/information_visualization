Description:
1. When you click the circle of each year, you can see the current year's electoral votes chart, vote percentage chart, tile chart. And also if you brush the electoral votes chart, it will show the states name you selected by brushing on the right of the screen.

2.You can only brush on the electoral vote chart, when you change the range of the brush(through dragging), it will also update the tile chart and the brush selection on the right, and also it will update the states you selected with a black border.

3.If you want to cancel the selection by brush, you can just select another year and click back to see the original map of the year.

4.Hovering over the bars will display the name of the nominee and the total number of votes respective percentages for all the parties in a tooltip. And also for the tile chart, hovering over each rectangle will should the detail of the state name(different colors related three parties), the electoral votes and the information about the three parties(percentage etc.).

5.The legend will show each color range, I also show the color range for the independent party if it existed in the current year.

6. I implement the shift chart, it will show the name of the state you selected, and compared the data from current year and previous election year (e.g "1976" and "1972", if you selected "1976").The zero point is in the middle of the dash line, the left of the middle point shows the negative value which means decrement, and the right of the middle point shows the positive value which means increment.You can also hover over the bars to see the detail information of the state. If it existed three parties, I use the opacity value to handle the overlap situation, so you can see three bars easily. I draw this axis based on the max difference between current year and previous election year.

7. It will show better through chrome and Firefox with zoom 100%.