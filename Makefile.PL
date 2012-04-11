use strict;
use warnings;

use ExtUtils::MakeMaker;

WriteMakefile(
  NAME          => 'Mojolicious::Plugin::Pedro',
  VERSION_FROM  => 'lib/Mojolicious/Plugin/Pedro.pm',
  ABSTRACT_FROM => 'lib/Mojolicious/Plugin/Pedro.pm',
  AUTHOR        => 'Ahmad M. Zawawi <ahmad.zawawi@gmail.com>',
  PREREQ_PM     => {'Mojolicious' => '2.80'},
  EXE_FILES     => ['script/pedro'],
  test          => {TESTS => 't/*.t'}
);
