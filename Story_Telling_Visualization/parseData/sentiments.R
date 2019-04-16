library(dplyr)
library(tidytext)
library(tidyr)
library(ggplot2)

##############

setwd("~/Desktop/R")
contents <- read.csv("CONTENTS.csv", stringsAsFactors=FALSE)
custom_stop_words <- bind_rows(stop_words,
                               data_frame(word = c("stark", "mother", "father", "daughter", "brother", "rock", "ground", "lord", "guard", "shoulder", "king", "main", "grace", "gate", "horse", "eagle", "servent","dance","shell","hood","gentleman","wages",
                                                   "master","cap"),
                                          lexicon = c("custom")))
join_term <- c("joy","anticipation","trust","surprise",
               "superfluous","litigious","NA","uncertainty",
               "constraining","sadness","disgust","fear","anger")

sentiment <- function(text_){
  text_name <- c('~/Desktop/ipynb/',text_,'_NEW.csv')
  filename <- do.call(paste, c(as.list(text_name), sep = ""))
  script <- read.csv(file = filename, stringsAsFactors=FALSE)
  tidy_script <- script %>%
    unnest_tokens(word, text)
  text_new <- as.data.frame(tidy_script %>%
                              anti_join(custom_stop_words) %>%
                              inner_join(get_sentiments("nrc")) %>%
                              filter(sentiment != "negative" & sentiment != "positive") %>%
                              count(line, sentiment) %>%
                              arrange(line))
  
  colnames(text_new) <- c('line','key','value')
  
  write.csv(text_new, file = do.call(paste, c(as.list(c(text_,'_st.csv')), sep = "")),row.names=FALSE)
}

for (text in contents$text){
  sentiment(text)
}
